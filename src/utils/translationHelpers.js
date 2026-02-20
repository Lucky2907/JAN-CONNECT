// Helper functions for translating dynamic content like categories and statuses

export const translateCategory = (category, t) => {
  return t(`categories.${category}`) || category;
};

export const translateStatus = (status, t) => {
  return t(`status.${status}`) || status;
};

export const translateSeverity = (severity, t) => {
  const severityMap = {
    'low': t('submitComplaint.low'),
    'medium': t('submitComplaint.medium'),
    'high': t('submitComplaint.high')
  };
  return severityMap[severity] || severity;
};
