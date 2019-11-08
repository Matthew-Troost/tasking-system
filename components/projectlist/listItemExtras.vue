<template>
  <div>
    <Loading v-show="loading" :width="100" position="unset" />
    <b-card v-show="!loading">
      <b-tabs active-nav-item-class="nav nav-tabs" content-class="mt-3">
        <b-tab title="Notes" active>
          <VueEditor :editor-toolbar="customToolbar" />
          <div class="chat-sidebar-container">
            <div class="chat-content-wrap">
              <div class="chat-content">
                <div class="d-flex mb-30 user">
                  <ProjectAvatar
                    image-url="@/assets/images/avatars/matthewt.svg"
                    :hide-nick-name="true"
                    :width="35"
                    nick-name="Matt"
                    class="m-r-10"
                  />
                  <div class="message flex-grow-1">
                    <div class="d-flex">
                      <p class="mb-1 text-title text-16 flex-grow-1">
                        Jhon Doe
                      </p>
                      <span class="text-small text-muted">24 min ago</span>
                    </div>
                    <p class="m-0">Lorem ipsum dolor sit amet.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab title="Uploads"> </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import { VueEditor } from "vue2-editor"
import ProjectAvatar from "@/components/projectAvatar"
import Loading from "../loading"

export default {
  components: {
    VueEditor,
    ProjectAvatar,
    Loading
  },
  data() {
    return {
      loading: true,
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "code-block"]
      ]
    }
  }
}
</script>
