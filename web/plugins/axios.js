export default function ({
    $axios,
    store
}) {
    $axios.onRequest(config => {

        config.headers['x-api-key'] = store.state.token || ''
        config.headers['x-api-currency'] = store.state.coin || ''
        config.headers['x-api-language'] = store.state.language || ''
        config.headers['x-api-area'] = store.state.areaId || '' // 当前所属地区
        config.headers['x-api-server'] = process.server ? 1 : 0 //是否是服务器端请求
        config.headers['x-api-platform'] = store.state.platform || '' //10=>PC-港澳台 20=>PC-大陆 30=》PC-美国
        // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        return config
    })



    $axios.onResponse(res => {
        const data = res.data || {}
        /*
        if (process.server == false) {
            let accessToken = localStorage.getItem('accessToken')
            //console.log('t1======>', accessToken, ',', store.state.token)
            if (!accessToken && store.state.token) {
                store.dispatch('logout')
                window.location.href = '/login'
            }
        }*/
        if (data.hasOwnProperty('code')) {
            if (data.code == 200) {
                return Promise.resolve(![undefined].includes(data) ? data : null)
                //return Promise.resolve(data.data || null)
            } else if (data.code == 401) {
                if (process.server == false) {
                    let accessToken = localStorage.getItem('accessToken')
                    if (!accessToken || accessToken == store.state.token) {
                        store.dispatch('logout')
                        window.location.href = '/login'
                    } else {
                        store.commit('setToken', accessToken)
                        window.location.reload()
                    }
                }
            } else {
                return Promise.reject(new Error(data.message || 'something error'))
            }
        } else {
            return Promise.resolve(data || null)
        }
    })
    $axios.onError(error => {
        // console.log('$axios.onError===>', error)
        return Promise.reject(error)
    })
}
