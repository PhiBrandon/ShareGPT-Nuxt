<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Navigation from '~/components/Navigation.vue';

const mode = ref('sft')
const inputFields = ref([
  { user: '', gpt: '' }
])
const dpoFields = ref([
  { prompt: '', chosen: '', rejected: '' }
])
const system = ref('')

function addField(event) {
  event.preventDefault()
  inputFields.value.push({ user: '', gpt: '' })
}

function removeField(index) {
  if (inputFields.value.length > 1) {
    inputFields.value.splice(index, 1)
  }
}

async function submitForm() {
  const formData = {
    system: system.value,
    turns: mode.value === 'sft' ? inputFields.value : dpoFields.value
  }

  try {
    const response = await $fetch(`/api/${mode.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    if (response.ok) {
      console.log('Form submitted successfully')
      resetForm()
    } else {
      console.error('Form submission failed')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

function resetForm() {
  system.value = ''
  if (mode.value === 'sft') {
    inputFields.value.forEach(field => {
      field.user = ''
      field.gpt = ''
    })
  } else {
    dpoFields.value.forEach(field => {
      field.prompt = ''
      field.chosen = ''
      field.rejected = ''
    })
  }
}
</script>

<template>
  <Navigation />
  <!-- Overall Wrapper -->
  <div class="h-screen flex flex-col items-center">
    <!-- SFT/DPO Selector -->
    <div class="mt-24 space-x-4">
      <Button class="px-20 py-10 text-2xl" @click="mode = 'sft'" :class="{ 'bg-blue-500': mode === 'sft' }">SFT</Button>
      <Button class="px-20 py-10 text-2xl" @click="mode = 'dpo'" :class="{ 'bg-blue-500': mode === 'dpo' }">DPO</Button>
    </div>
    <!-- SFT Content -->
    <form v-if="mode === 'sft'" id="sft-form" class="px-32 space-y-6 mt-10" @submit.prevent="submitForm">
      <Input class="min-w-80 py-8" placeholder="System" v-model="system" />
      <div v-for="(field, index) in inputFields" :key="index" class="space-y-2">
        <Input class="min-w-80 py-8" v-model="field.user" :id="'user_' + (index + 1 )" :placeholder="'User ' + (index + 1)" />
        <Input class="min-w-80 py-8" v-model="field.gpt" :id="'gpt_' + (index + 1 )" :placeholder="'GPT ' + (index + 1)" />
      </div>
      <!-- Button to add fields -->
      <div class="flex justify-between">
        <Button class="min-w-32" @click="addField">Add turn</Button>
        <Button class="min-w-32" @click="removeField(index)">Remove</Button>
      </div>
      <!-- Submit button -->
      <div >
        <Button class="min-w-full" type="submit">Submit</Button>
      </div>
    </form>
    <!-- DPO Content -->
    <form v-else id="dpo-form" class="px-32 space-y-2 mt-10" @submit.prevent="submitForm">
      <Input class="min-w-80 py-8" placeholder="System" v-model="system" />
      <div v-for="(field, index) in dpoFields" :key="index" class="space-y-4">
        <Input class="min-w-80 py-8" v-model="field.prompt" :placeholder="'Prompt ' + (index + 1)" />
        <Input class="min-w-80 py-8" v-model="field.chosen" :placeholder="'Chosen ' + (index + 1)" />
        <Input class="min-w-80 py-8" v-model="field.rejected" :placeholder="'Rejected ' + (index + 1)" />
      </div>
      <!-- Submit button -->
      <div>
        <Button class="min-w-full" type="submit">Submit</Button>
      </div>
    </form>
  </div>
</template>