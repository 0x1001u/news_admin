<template>
  <div class="table-actions">
    <el-button
      v-for="action in actions"
      :key="action.label"
      :icon="action.icon"
      @click="action.handler"
    >
      {{ action.label }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineProps } from 'vue';
import type { PropType } from 'vue';
import type { NewsItem, Category } from '@/types';

interface ActionItem {
  label: string;
  handler: () => void;
  icon?: string;
}

const props = defineProps({
  row: { type: Object as PropType<NewsItem | Category>, required: true },
  actions: { type: Array as PropType<ActionItem[]>, default: () => [] }
});
</script>

<style scoped>
.table-actions {
  display: flex;
  gap: 8px;
}
</style>