<template>
  <div>
    <div class="welcome">Welcome</div>
  </div>
</template>

<script>
  import {Login} from '../../network/login'

  export default {
    name: "Welcome",
    data(){
      return{
      }
    }
  }
</script>

<style scoped>
.welcome{
  width: 100%;
  font-size: 80px;
  color: #4a5064;
}
</style>