<template>
  <div class="main-content">
    <h2 class="page-title">Systems</h2>
    <b-row>
      <b-card class="mb-30 text-15 w-100" title="Network for Animals">
        <b-row>
          <b-col md="4">
            <p>
              Team member avatars here.
            </p>
          </b-col>
          <b-col md="4">
            <b-progress max="30" height="2rem">
              <b-progress-bar variant="danger" value="10">
                Progress: <strong>10 / 30</strong>
              </b-progress-bar>
            </b-progress>
          </b-col>
          <b-col md="4" class="text-right">
            <b-button pill variant="primary">Go somewhere</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-row>
  </div>
</template>
<script>
export default {
  layout: "default",
  name: "Systems"
}
</script>
