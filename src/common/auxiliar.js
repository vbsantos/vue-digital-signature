const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTitle = (envelope) => {
  const createdAt = formatDate(envelope.createdAt);
  const title = `Criado em: ${createdAt}`;
  if (!envelope.updatedAt) {
    return title;
  }
  const updatedAt = formatDate(envelope.updatedAt);
  return `${title} | Alterado em: ${updatedAt}`;
};

export { formatDate, formatTitle };
