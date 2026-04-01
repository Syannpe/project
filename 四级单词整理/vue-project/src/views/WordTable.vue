<script setup lang="ts">
/*
* AUTHOR: zheng
* DATETIME: 2026/3/29-13:49
* NAME: wordTable
* DESC: 
*/
import {sortedData} from "@/data.ts";


</script>

<template>
  <table class="word-table">
    <thead>
    <tr>
      <td>单词</td>
      <td>汉译</td>
      <td>音标</td>
      <td>考察次数</td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="word in sortedData">
      <td>{{ word.单词 }}</td>
      <td>{{ word.汉译 }}</td>
      <td>{{ word.音标 }}</td>
      <td>{{ word.考察次数 }}</td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.word-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 15px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.word-table thead {
  background-color: var(--darkreader-text-00bd7e, #48ffc2);
  text-align: left;
  font-weight: 600;
}

.word-table th,
.word-table td {
  padding: 14px 18px;
}

.word-table tbody tr {
  transition: background 0.2s ease;
}

.word-table tbody tr:hover {
  outline: var(--darkreader-text-00bd7e, #48ffc2) solid 1px;
}

.word-table tbody tr:last-child td {
  border-bottom: none;
}

/* 音标样式 */
.phonetic {
  color: #6b7280;
  font-family: "Arial", sans-serif;
}

/* 考察次数标签 */
.count {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--darkreader-text-00bd7e, #48ffc2);
  font-size: 13px;
  font-weight: 500;
}
</style>