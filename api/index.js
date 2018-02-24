const uri = 'http://192.168.88.112:8000';
export const api = {
    homepage: `${uri}/`,
    article: (id) => `${uri}/story/${id}`,
    extra: (id) => `${uri}/story-extra/${id}`,
    history: (date) => `${uri}/before/${date}`
};
