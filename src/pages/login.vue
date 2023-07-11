<template>
<div class="content">
    <div class="row" style="width: 64%;text-align: center;display: inline-block;">
        <div class="card login-card">
            <div class="card-body">
                <h2 class="login-card-title">Login</h2>
                <form action="#!">
                    <div class="form-group">
                        <label for="username" class="sr-only">User Name</label>
                        <input type="username" name="username" id="username" class="form-control" placeholder="User Name">
                    </div>
                    <div class="form-group">
                        <label for="password" class="sr-only">Password</label>
                        <input type="password" name="password" id="password" class="form-control" placeholder="Password">
                    </div>
                    <input name="login" id="login" class="btn btn-block login-btn mb-4" type="button" value="Login" @click="handleLogin()">
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    name: 'Login',
    data() {
        return {
            user: {
                username: 'thanh123',
                password: '123456a',
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

                console.log(this.user);
                if (this.user.username && this.user.password) {
                    this.$store.dispatch('auth/login', this.user).then(
                        () => {
                            this.$router.push('/dashboard');
                        },
                        error => {
                            this.loading = false;
                            this.message =
                                (error.response && error.response.data) ||
                                error.message ||
                                error.toString();
                        }
                    );
                }
            });
        }
    }
};
</script>
