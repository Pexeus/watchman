<template>
    <div class="login">
        <div class="form">
            <h1>{{ login.form.message }}</h1>
            <input v-model="login.form.user" class="transparent-input" type="text" placeholder="user">
            <input v-model="login.form.password" class="transparent-input" type="password" placeholder="password">
            <button @click="auth()" class="transparent-button">Login</button>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue';
import config from "../config";

export default {
    name: 'Login',
    components: {

    },
    setup() {
        const api = config.interfaces.api;

        const login = reactive({
            form: {
                user: "",
                password: "",
                message: " ",
            }
        })

        async function auth() {
            const { data: result } = await api.post("/auth/login", login.form)

            if (result.success == true) {
                localStorage.setItem("auth", JSON.stringify(result))
                location.reload()
            }

            login.form.message = result.message
            setTimeout(() => {
                login.form.message = " "
            }, 2000);
        }

        return { login, auth }
    }
}
</script>

<style scoped>
.login {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-width: 20%;
}

.form h1 {
    height: 30px;
    font-size: 15pt;
}

.form * {
    margin: 10px;
    font-family: monospace;
}

input {
    border: none;
    outline: none;
}

.transparent-input {
    background-color: transparent;
    border: 1px solid white;
    padding: 10px;
    border-radius: 8px;
    color: white;
    width: 100%;
}

.transparent-input:focus {
    border-color: #3498db;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
}

button {
    border: none;
    outline: none;
    cursor: pointer;
}

.transparent-button {
    background-color: transparent;
    border: 1px solid white;
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    font-size: 16px;
}

.transparent-button:hover {
    background-color: #3498db;
    border-color: #3498db;
}
</style>