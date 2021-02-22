export default (ok: boolean, message = "", payload = {}) => {
    return {
        ok,
        message,
        payload
    }
}