<template>
  <v-container class="d-flex fill-height" fluid>
    <v-row class="center-content">
      <v-col cols="12" md="4">
        <v-card >
          <v-card-title >Login</v-card-title>
          <v-card-text>
            <!-- Form สำหรับ Login -->
            <v-form ref="form" @submit.prevent="login">
              <v-text-field
                v-model="emailOrPhone"
                :rules="[emailOrPhoneRule]"
                label="Email or Phone"
                outlined
                dense
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="[passwordRule]"
                label="Password"
                type="password"
                outlined
                dense
                required
              ></v-text-field>

              <v-btn type="submit" class="btn-black" block>Login</v-btn>

              <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      emailOrPhone: '',
      password: '',
      errorMessage: '',
    };
  },
  computed: {
    emailOrPhoneRule() {
      return v => !!v || 'Email or Phone is required';
    },
    passwordRule() {
      return v => (v && v.length >= 4 && v.length <= 60) || 'Password must be between 4 and 60 characters';
    }
  },
  methods: {
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validatePhone(phone) {
      const phoneRegex = /^[0-9]{10}$/; 
      return phoneRegex.test(phone);
    },
    async login() {
      if (!this.$refs.form.validate()) {
        this.errorMessage = 'Please correct the errors above.';
        return;
      }

      let isValid = false;
      if (this.validateEmail(this.emailOrPhone)) {
        isValid = true;
      } else if (this.validatePhone(this.emailOrPhone)) {
        isValid = true;
      } else {
        this.errorMessage = 'Invalid Email or Phone format.';
        return;
      }

      if (isValid) {
        try {
          const response = await this.$axios.$post('http://localhost:5000/api/auth/login', { emailOrPhone: this.emailOrPhone, password: this.password });
          localStorage.setItem('user', JSON.stringify(response.user));
          this.$router.push('/profile');
        } catch (error) {
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
        }
      }
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.btn-black {
  background-color: #000;
  color: #000000;
}
.btn-black:hover {
  background-color: #67f88b;
}
</style>
