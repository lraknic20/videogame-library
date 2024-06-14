<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

authStore.logout();

const router = useRouter();
router.push('/');
</script>