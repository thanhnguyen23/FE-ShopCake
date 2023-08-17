<template>
<div class="content">
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <img src="../../public/undraw_remotely_2j6y.svg" alt="Image" class="img-fluid">
            </div>
            <div class="col-md-6 contents">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="mb-4">
                            <h3 style="color: black">Sign In</h3>
                            <p class="mb-4">Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur adipisicing.</p>
                        </div>
                        <form action="#" method="post">
                            <div class="form-group first">
                                <input type="text" class="form-control" id="username" placeholder="username" v-model="user.username">

                            </div>
                            <div class="form-group last mb-4">
                                <input type="password" class="form-control" id="password" placeholder="password" v-model="user.password">
                            </div>

                            <input type="button" value="Log In" class="btn btn-block btn-primary" @click="handleLogin()">

                            <span class="d-block text-left my-4 text-muted">&mdash; or login with &mdash;</span>

                            <div class="social-login">
                                <a href="#" class="facebook">
                                    <span class="icon-facebook mr-3"></span>
                                </a>
                                <a href="#" class="twitter">
                                    <span class="icon-twitter mr-3"></span>
                                </a>
                                <a href="#" class="google">
                                    <span class="icon-google mr-3"></span>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

        </div>
    </div>
</div>
</template>

<script>
import NotificationTemplate from "./Notifications/NotificationTemplate";
export default {
    name: 'Login',
    data() {
        return {
            user: {
                username: '',
                password: '',
            }
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        }
    },
    created() {
        if (!this.loggedIn) {
            this.$router.push('/login');
        }
    },
    methods: {
        handleLogin() {
            this.loading = true;
            this.$validator.validateAll().then(isValid => {
                if (!isValid) {
                    this.loading = false;
                    return;
                }

                if (this.user.username && this.user.password) {
                    this.$store.dispatch('auth/login', this.user).then(
                        () => {
                            this.$router.push('/dashboard');
                            this.notifyVue('success', 'Đăng nhập thành công!');
                        },
                        error => {
                            this.loading = false;
                            this.$router.push('/login');
                            this.notifyVue('danger', 'Đăng nhập thất bại!');
                            this.message =
                                (error.response && error.response.data) ||
                                error.message ||
                                error.toString();
                        }
                    );
                }
            });
        },
        notifyVue(color, message) {
            this.$notify({
                component: NotificationTemplate,
                icon: "tim-icons icon-bell-55",
                horizontalAlign: 'top',
                verticalAlign: 'right',
                type: color,
                timeout: 3000,
                message: message,
            });
        },
    }
};
</script>

<style src="../../public/css/cssLogin.css" scoped></style>
