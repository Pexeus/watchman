<template>
    <div class="nav">
        <div class="left">
            <i class="gg-play-button-o"></i>
            <h3>Watchman</h3>
        </div>
        <div class="right">
            <p>Logged in as {{ nav.auth.user }}</p>
            <i @click="logout()" class="gg-log-off"></i>
        </div>
    </div>
</template>

<script>
import { getAuth } from '@/auth';
import { reactive } from 'vue';

export default {
    setup() {
        const nav = reactive({
            auth: getAuth()
        })

        function logout() {
            localStorage.setItem("auth", false)
            location.reload()
        }

        return {nav, logout}
    },
}
</script>

<style scoped>
    .nav {
        background-color: var(--gray1);
        position: sticky;
        top: 0;
        width: 100%;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .nav div {
        padding: 15px;
    }

    .left {
        display: flex;
    }

    .right {
        font-size: small;
        display: flex;
    }

    .right p {
        padding-right: 10px;
    }

    .left h3 {
        padding-left: 10px;
    }

    .right i {
        cursor: pointer;
    }
</style>