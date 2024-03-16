<script setup>
  import { ref } from 'vue'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import Navigation from '~/components/Navigation.vue';
  
  const dpoData = ref([])
  
  async function fetchDpoData() {
    try {
      dpoData.value = await $fetch('/api/dpo')
    } catch (error) {
      console.error('Error fetching DPO data:', error)
    }
  }
  
  async function saveChanges() {
    try {
      await $fetch('/api/dpo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dpoData.value)
      })
      console.log('Changes saved successfully')
    } catch (error) {
      console.error('Error saving changes:', error)
    }
  }
  
  fetchDpoData()
  </script>

<template>
    <Navigation />
    <div class="h-screen flex flex-col items-center">
      <h1 class="mt-24 text-2xl">DPO Data</h1>
      <form class="px-32 space-y-6 mt-10" @submit.prevent="saveChanges">
        <div v-for="(item, index) in dpoData" :key="item.id" class="space-y-4">
          <h2 class="text-xl">Entry {{ index + 1 }}</h2>
          <Input class="min-w-80 py-8" v-model="item.system" placeholder="System" />
          <div v-for="(turn, turnIndex) in item.turns" :key="turnIndex" class="space-y-2">
            <Input class="min-w-80 py-8" v-model="turn.prompt" :placeholder="'Prompt ' + (turnIndex + 1)" />
            <Input class="min-w-80 py-8" v-model="turn.chosen" :placeholder="'Chosen ' + (turnIndex + 1)" />
            <Input class="min-w-80 py-8" v-model="turn.rejected" :placeholder="'Rejected ' + (turnIndex + 1)" />
          </div>
        </div>
        <Button class="min-w-full" type="submit">Save Changes</Button>
      </form>
    </div>
  </template>
  
  