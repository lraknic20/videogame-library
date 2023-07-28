<script setup lang="ts">
    import { useRouter } from 'vue-router';

    localStorage.removeItem('id');
    localStorage.removeItem('korime');
    localStorage.removeItem('token');

    const router = useRouter();
    router.push('/');
    router.go(0);
</script>