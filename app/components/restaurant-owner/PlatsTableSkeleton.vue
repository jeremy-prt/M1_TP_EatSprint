<template>
  <div class="-skew-x-3 flex h-full flex-col overflow-hidden bg-white shadow-[8px_8px_0_#fb923c]">
    <div class="border-b-2 border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="h-8 w-32 animate-pulse rounded bg-gray-300"></div>
        <div class="h-10 w-40 animate-pulse rounded bg-gray-300"></div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">
              <div class="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
            </th>
            <th class="px-6 py-3 text-left">
              <div class="h-4 w-12 animate-pulse rounded bg-gray-300"></div>
            </th>
            <th class="px-6 py-3 text-left">
              <div class="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
            </th>
            <th class="px-6 py-3 text-center">
              <div class="mx-auto h-4 w-20 animate-pulse rounded bg-gray-300"></div>
            </th>
            <th class="px-6 py-3 text-right">
              <div class="ml-auto h-4 w-16 animate-pulse rounded bg-gray-300"></div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="i in 5" :key="i">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="h-12 w-12 animate-pulse rounded bg-gray-300"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
                  <div class="h-3 w-48 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="h-4 w-12 animate-pulse rounded bg-gray-300"></div>
            </td>
            <td class="px-6 py-4">
              <div class="h-6 w-24 animate-pulse rounded bg-gray-300"></div>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="mx-auto h-6 w-16 animate-pulse rounded bg-gray-300"></div>
            </td>
            <td class="px-6 py-4">
              <div class="ml-auto flex gap-2">
                <div class="h-9 w-9 animate-pulse rounded-full bg-gray-300"></div>
                <div class="h-9 w-9 animate-pulse rounded-full bg-gray-300"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
