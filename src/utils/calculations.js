export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const detectDuplicateComplaints = (newComplaint, existingComplaints, radius = 300) => {
  return existingComplaints.filter(complaint => {
    const distance = haversineDistance(
      newComplaint.latitude,
      newComplaint.longitude,
      complaint.latitude,
      complaint.longitude
    );
    return distance <= radius && complaint.category === newComplaint.category;
  });
};

export const findNearbyComplaint = (newComplaint, existingComplaints, radius = 100) => {
  const nearby = existingComplaints.filter(complaint => {
    // Only check unresolved complaints
    if (complaint.status === 'Resolved') return false;
    
    const distance = haversineDistance(
      newComplaint.latitude,
      newComplaint.longitude,
      complaint.latitude,
      complaint.longitude
    );
    
    // Check if within radius and same category
    return distance <= radius && complaint.category === newComplaint.category;
  });

  // Return the closest one if multiple found
  if (nearby.length > 0) {
    return nearby.reduce((closest, complaint) => {
      const distClosest = haversineDistance(
        newComplaint.latitude,
        newComplaint.longitude,
        closest.latitude,
        closest.longitude
      );
      const distCurrent = haversineDistance(
        newComplaint.latitude,
        newComplaint.longitude,
        complaint.latitude,
        complaint.longitude
      );
      return distCurrent < distClosest ? complaint : closest;
    });
  }
  
  return null;
};

export const calculateRiskScore = (complaints, areaRadiusKm = 1) => {
  const severityWeights = {
    low: 1,
    medium: 2,
    high: 3
  };

  const unresolvedComplaints = complaints.filter(c => c.status !== 'Resolved');
  
  const totalWeight = unresolvedComplaints.reduce((sum, complaint) => {
    return sum + (severityWeights[complaint.severity] || 1);
  }, 0);

  const areaDensity = unresolvedComplaints.length / (Math.PI * areaRadiusKm * areaRadiusKm);
  
  return totalWeight * areaDensity * 10;
};

export const calculateResolutionTime = (createdAt, resolvedAt) => {
  if (!resolvedAt) return null;
  const diff = new Date(resolvedAt) - new Date(createdAt);
  return Math.floor(diff / (1000 * 60 * 60));
};

export const checkEscalation = (complaint) => {
  const now = new Date();
  const created = new Date(complaint.createdAt);
  const hoursDiff = (now - created) / (1000 * 60 * 60);
  
  return hoursDiff > 48 && complaint.status !== 'Resolved';
};

export const getRiskLevel = (score) => {
  if (score > 20) return { level: 'high', color: 'bg-red-500', label: 'High Risk' };
  if (score > 10) return { level: 'medium', color: 'bg-yellow-500', label: 'Medium Risk' };
  return { level: 'low', color: 'bg-green-500', label: 'Low Risk' };
};

export const calculateDepartmentMetrics = (complaints, department) => {
  const deptComplaints = complaints.filter(c => c.assignedDepartment === department);
  const resolved = deptComplaints.filter(c => c.status === 'Resolved');
  
  const resolutionTimes = resolved
    .map(c => calculateResolutionTime(c.createdAt, c.resolvedAt))
    .filter(t => t !== null);
  
  const avgResolutionTime = resolutionTimes.length > 0
    ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
    : 0;
  
  const slaBreaches = resolved.filter(c => {
    const time = calculateResolutionTime(c.createdAt, c.resolvedAt);
    return time > 72;
  }).length;
  
  const resolutionRate = deptComplaints.length > 0
    ? (resolved.length / deptComplaints.length) * 100
    : 0;
  
  const slaBreachPercentage = resolved.length > 0
    ? (slaBreaches / resolved.length) * 100
    : 0;
  
  return {
    avgResolutionTime: avgResolutionTime.toFixed(1),
    slaBreachPercentage: slaBreachPercentage.toFixed(1),
    resolutionRate: resolutionRate.toFixed(1),
    totalComplaints: deptComplaints.length,
    resolved: resolved.length
  };
};

export const getStatusColor = (status) => {
  const colors = {
    'Submitted': 'bg-blue-500',
    'In Review': 'bg-yellow-500',
    'Assigned': 'bg-purple-500',
    'Resolved': 'bg-green-500'
  };
  return colors[status] || 'bg-gray-500';
};

export const getSeverityColor = (severity) => {
  const colors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };
  return colors[severity] || 'bg-gray-500';
};
