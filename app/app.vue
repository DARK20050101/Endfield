<script setup lang="ts">
import { computed, ref } from 'vue'
import { makeProbeReport, openOfficialLogin, type PageObservation, type BindingObservation } from './services/login-probe'
const page = ref<PageObservation>('not_tested')
const binding = ref<BindingObservation>('not_checked')
const status = ref('尚未打开登录页')
const busy = ref(false)
const report = computed(() => JSON.stringify(makeProbeReport(page.value, binding.value), null, 2))
async function openLogin() {
  if (busy.value) return
  busy.value = true
  status.value = '正在请求打开官方页面…'
  try {
    await openOfficialLogin()
    status.value = '已请求打开官方页面。请确认浏览器是否打开；返回后记录观察结果。'
  } catch {
    status.value = '未能打开官方页面，请检查默认浏览器后重试。'
  } finally { busy.value = false }
}
function clear() {
  page.value = 'not_tested'
  binding.value = 'not_checked'
  status.value = '观察结果已清空'
}
</script>

<template>
  <main>
    <header><span class="eyebrow">ENDFIELD TRACE / PHASE 0</span><p class="badge">开发验证版</p></header>
    <h1>先确认手机授权路径</h1>
    <p class="intro">此版本只验证官方页面能否打开、是否能看到绑定角色。应用尚未接收游戏授权，不能同步寻访记录。</p>
    <section aria-labelledby="login-title">
      <span class="step">01 / 官方页面</span>
      <h2 id="login-title">在官方页面查看账号绑定</h2>
      <p>将通过浏览器打开鹰角用户中心。返回这里后，记录你看到的结果。</p>
      <a href="https://user.hypergryph.com/" target="_blank" rel="noopener noreferrer" class="domain">user.hypergryph.com</a>
      <button :disabled="busy" @click="openLogin">{{ busy ? '正在打开…' : '打开官方用户中心' }}</button>
      <p role="status" aria-live="polite">{{ status }}</p>
      <p class="muted">网页登录不代表本应用已获得授权。不要在此页面填写密码、Token 或完整寻访链接。</p>
    </section>
    <section aria-labelledby="result-title">
      <span class="step">02 / 本次观察</span>
      <h2 id="result-title">记录结果</h2>
      <label for="page-result">官方页面</label>
      <select id="page-result" v-model="page">
        <option value="not_tested">尚未检查</option><option value="loaded">页面能正常打开</option>
        <option value="network_error">网络异常 / 无法加载</option><option value="login_unavailable">页面打开，但无法完成登录</option>
      </select>
      <label for="binding-result">终末地 B服绑定角色</label>
      <select id="binding-result" v-model="binding">
        <option value="not_checked">尚未检查 / 不确定</option><option value="visible">我能看到自己的 B服绑定角色</option>
        <option value="missing">我未看到 B服绑定角色</option>
      </select>
      <p class="muted">以上仅是你的观察，不是程序验证。只保留在当前页面，刷新后清空。</p>
      <details><summary>查看不含账号信息的观察摘要</summary><pre>{{ report }}</pre></details>
      <button class="secondary" @click="clear">清空观察结果</button>
    </section>
    <footer>下一关：验证安全授权返回，再验证角色与武器记录。</footer>
  </main>
</template>
