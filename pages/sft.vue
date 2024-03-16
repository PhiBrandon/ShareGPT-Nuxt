<script setup>
  import { ref } from 'vue'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import Navigation from '~/components/Navigation.vue';
  
  const sftData = ref([])
  
  async function fetchSftData() {
    try {
      sftData.value = await $fetch('/api/sft')
    } catch (error) {
      console.error('Error fetching SFT data:', error)
    }
  }
  
  async function saveChanges() {
    try {
      await $fetch('/api/sft', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sftData.value)
      })
      console.log('Changes saved successfully')
    } catch (error) {
      console.error('Error saving changes:', error)
    }
  }
  
  fetchSftData()
  </script>

<template>
    <Navigation />

    <div class="h-screen flex flex-col items-center">
      <h1 class="mt-24 text-2xl">SFT Data</h1>
      <form class="px-32 space-y-6 mt-10" @submit.prevent="saveChanges">
        <div v-for="(item, index) in sftData" :key="item.id" class="space-y-4">
          <h2 class="text-xl">Entry {{ index + 1 }}</h2>
          <Input class="min-w-80 py-8" v-model="item.system" placeholder="System" />
          <div v-for="(turn, turnIndex) in item.turns" :key="turnIndex" class="space-y-2">
            <Input class="min-w-80 py-8" v-model="turn.user" :placeholder="'User ' + (turnIndex + 1)" />
            <Input class="min-w-80 py-8" v-model="turn.gpt" :placeholder="'GPT ' + (turnIndex + 1)" />
          </div>
        </div>
        <Button class="min-w-full" type="submit">Save Changes</Button>
      </form>
    </div>
  </template>
  
  