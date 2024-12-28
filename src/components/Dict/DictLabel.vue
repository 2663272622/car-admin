<template>
  <div v-if="Array.isArray(props.modelValue)">
    <template v-for="(modelItem, index) in props.modelValue" :key="index" >
      <template v-if="tagTypeList[index]">
        <el-tag :type="tagTypeList[index]" class="mr-2 mt-2" :size="tagSize">{{ labelList[index] }}</el-tag>
      </template>
      <template v-else>
        <span>{{ labelList[index] }}</span>
      </template>
    </template>
  </div>
  <div v-else>
    <template v-if="tagType">
      <el-tag :type="tagType" :size="tagSize">{{ label }}</el-tag>
    </template>
    <template v-else>
      <span>{{ label }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDictStore } from "@/store";
const dictStore = useDictStore();

const props = defineProps({
  code: String,
  modelValue: [String, Number, Array],
  size: {
    type: String,
    default: "default",
  },
});

const label = ref("");
const tagType = ref<"success" | "warning" | "info" | "primary" | "danger" | undefined>();
const labelList = ref<string[]>([]); 
const tagTypeList = ref<("success" | "warning" | "info" | "primary" | "danger" | undefined)[]>([]); 

const tagSize = ref(props.size as "default" | "large" | "small");

const getLabelAndTagByValue = async (dictCode: string, value: any) => {
  // 先从本地缓存中获取字典数据
  const dictData = dictStore.getDictionary(dictCode);

  // 查找对应的字典项
  const dictEntry = dictData.find((item: any) => item.value == value);
  return {
    label: dictEntry ? dictEntry.label : "",
    tag: dictEntry ? dictEntry.tagType : undefined,
  };
};

// 处理modelValue为数组时的情况，循环获取每个元素对应的label和tag
const fetchLabelAndTagForArray = async () => {
  labelList.value = [];
  tagTypeList.value = [];
  if (Array.isArray(props.modelValue)) {
    for (const modelItem of props.modelValue) {
      const result = await getLabelAndTagByValue(props.code as string, modelItem);
      labelList.value.push(result.label);
      tagTypeList.value.push(result.tag as "success" | "warning" | "info" | "primary" | "danger" | undefined);
    }
  }
};

// 监听 props 的变化，获取并更新 label 和 tag
const fetchLabelAndTag = async () => {
  const result = await getLabelAndTagByValue(props.code as string, props.modelValue);
  label.value = result.label;
  tagType.value = result.tag as "success" | "warning" | "info" | "primary" | "danger" | undefined;
};

// 首次挂载时根据modelValue类型获取字典数据
onMounted(async () => {
  if (Array.isArray(props.modelValue)) {
    await fetchLabelAndTagForArray();
  } else {
    await fetchLabelAndTag();
  }
});

// 当modelValue发生变化时，根据其类型重新获取字典数据
watch(() => props.modelValue, async (newValue) => {
  if (Array.isArray(newValue)) {
    await fetchLabelAndTagForArray();
  } else {
    await fetchLabelAndTag();
  }
});
</script>
