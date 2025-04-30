<template>
    <v-container class="fill-height" fluid>
      <v-row class="center-content">
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Profile</v-card-title>
            <v-card-text >
            <div>
              <p class="text-subtitle-1" ><strong>Username:</strong> {{ user.username }}</p>
              <p class="text-subtitle-1 mb-2" ><strong>Email or Phone:</strong> {{ user.emailOrPhone }}</p>
            </div>
            <v-btn @click="logout">Logout</v-btn>
          </v-card-text>
            
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {},
      };
    },
    mounted() {
      // ใช้ localstorage เพื่อรับข้อมูลของ user
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      } else {
        this.$router.push('/login');
      }
      
    },
    methods: {
        logout() {
        this.$router.push('/login');
        }
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
  .text-subtitle-1 {
    font-size: 1rem;
    font-weight: 400;
  }
  .mb-2 {
    margin-bottom: 10px;
  }
  </style>