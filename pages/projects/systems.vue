<template>
  <div class="main-content">
    <b-row>
      <b-col md="8">
        <h2 class="page-title">
          Systems
          <small>
            <a v-b-modal.modal-add-project>
              <i class="nav-icon i-Add"></i>
              <span class="item-name"> Add New</span>
            </a>
          </small>
        </h2>
      </b-col>
      <b-col md="4">
        <b-form-input
          class="form-control-rounded"
          type="text"
          required
          placeholder="Search..."
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <b-card class="mb-30 text-15 w-100" title="Network for Animals">
          <b-row>
            <b-col md="6">
              <ProjectAvatar
                nick-name="Matt"
                image-url="@/assets/images/avatars/matthewt.svg"
              />
              <ProjectAvatar
                nick-name="Armand"
                image-url="@/assets/images/avatars/matthewt.svg"
              />
            </b-col>
            <b-col md="6" class="text-right">
              <div class="button-container">
                <b-button pill variant="primary ripple">View tasks</b-button>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card class="mb-30 text-15 w-100" title="Intelligent Safe">
          <b-row>
            <b-col md="6">
              <ProjectAvatar
                nick-name="Chris"
                image-url="@/assets/images/avatars/matthewt.svg"
              />
            </b-col>
            <b-col md="6" class="text-right">
              <div class="button-container">
                <b-button pill variant="primary ripple">View tasks</b-button>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-modal
      id="modal-add-project"
      centered
      hide-footer="true"
      hide-header="true"
      size="lg"
    >
      <div class="modal-addition-only">
        <b-form-input
          class="form-control-rounded input-extra-large"
          type="text"
          required
          placeholder="Enter project name..."
        ></b-form-input>
        <b-button pill variant="success ripple">Save</b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import ProjectAvatar from "../../components/projectAvatar"

export default {
  layout: "default",
  name: "Systems",
  components: {
    ProjectAvatar
  }
}
</script>
<style scoped>
.button-container {
  position: absolute;
  bottom: 0;
  right: 15px;
}
.modal-addition-only {
  display: flex;
}
.modal-addition-only input {
  margin-right: 15px;
}
</style>
