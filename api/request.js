



const uri = `http://news-at.zhihu.com:80/api/4`;
const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
};

export const latest = () => {
    return request(`${uri}/news/latest`)
};


export const history = (date) => {
    return request(`${uri}/news/before/${date}`)

};

export const article = (id) => {
    return request(`${uri}/news/${id}`)

};

export const extra = (id) => {
    request(`${uri}/news/story-extra/${id}`)
};

function request(url) {
    return fetch(url, headers).then(res => res.json())
}


