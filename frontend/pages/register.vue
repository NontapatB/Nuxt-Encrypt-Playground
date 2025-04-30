<template>
  <v-container fluid class="fill-height">
    <v-row class="center-content">
      <v-col cols="12" md="4">
        <v-card >
          <v-card-title >Register</v-card-title>
          <v-card-text>
            <!-- Username Field -->
            <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                outlined
                dense
                required
              ></v-text-field>

            <!-- Form สำหรับ registering -->
            <v-form ref="form" @submit.prevent="register">
              <v-text-field
                v-model="emailOrPhone"
                :rules="emailOrPhoneRules"
                label="Email or Phone"
                outlined
                dense
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                type="password"
                outlined
                dense
                required
              ></v-text-field>

              <v-btn type="submit" class="btn-black mt-3" block>Register</v-btn>

              <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p>Already have an account? <router-link to="/login">Login here</router-link></p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar สำหรับ success message -->
    <v-snackbar v-model="snackbar" color="success">
      {{ successMessage }}
      <v-btn color="white" text @click="redirectToLogin">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      emailOrPhone: '',
      password: '',
      errorMessage: '',
      successMessage: '',
      snackbar: false,
    };
  },
  computed: {
    usernameRules() {
      return [
        v => !!v || 'Username is required',
        v => v.length >= 3 || 'Username must be at least 3 characters long'
      ];
    },
    emailOrPhoneRules() {
      return [
        v => !!v || 'Email or Phone is required',
        v => this.validateEmail(v) || this.validatePhone(v) || 'Invalid Email or Phone format'
      ];
    },
    passwordRules() {
      return [
        v => !!v || 'Password is required',
        v => (v && v.length >= 4 && v.length <= 60) || 'Password must be between 4 and 60 characters'
      ];
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
    async register() {
      if (!this.$refs.form.validate()) {
        this.errorMessage = 'Please correct the errors above.';
        return;
      }

      try {
        await this.$axios.$post('http://localhost:5000/api/auth/register', {
          username: this.username, 
          emailOrPhone: this.emailOrPhone, 
          password: this.password });
        this.successMessage = 'You have successfully registered!';
        this.snackbar = true;

        setTimeout(this.redirectToLogin, 3000);
        
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    },
    redirectToLogin() {
      this.snackbar = false;
      this.$router.push('/login');
    }
  },
  
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
.bg-black {
  background-color: #000;
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
  background-color: #f86767;
}
</style>
