import axios from 'axios';

const API_URL = 'http://103.187.5.254:8090';

class AuthService {
    login(user) {
        return axios
            .post('/api/auth/signin', {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.roles.indexOf("ROLE_ADMIN") == -1) {
                    localStorage.removeItem('user');
                    return error;
                }

                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return axios.post(API_URL + 'signup', {
            username: user.username,
            email: user.email,
            password: user.password
        });
    }
}

export default new AuthService();