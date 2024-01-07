export function getAuth() {
    const user = localStorage.getItem("auth")

    if (!user) {
        return false
    }

    return JSON.parse(user)
}