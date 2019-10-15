<template>
  <div>
    <h2>Project</h2>
    <div id="gridDemo">
      <div class="grid-square" style="">Item 4</div>
      <div class="grid-square" style="">Item 5</div>
      <div class="grid-square" style="">Item 6</div>
      <div class="grid-square" style="">Item 7</div>
    </div>
    <br />

    <div id="simpleList" class="list-group">
      <div class="list-group-item">
        This is <a href="http://rubaxa.github.io/Sortable/">Sortable</a>
      </div>
      <div class="list-group-item"><input value="testing..." /></div>
      <div class="list-group-item">
        <b-row>
          <b-col md="6">
            <label class="checkbox checkbox-primary" style="display: inline">
              <input type="checkbox" checked="" />
              <span class="checkmark"></span>
            </label>
            <input
              value="testing..."
              style="padding-right: 10px; width: 100%"
            />
          </b-col>
          <b-col md="6">
            <b-dropdown
              id="dropdown-1"
              variant="primary"
              text="High Priority"
              size="sm"
            >
              <b-dropdown-item>First Action</b-dropdown-item>
              <b-dropdown-item>Second Action</b-dropdown-item>
              <b-dropdown-item>Third Action</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item active>Active action</b-dropdown-item>
              <b-dropdown-item disabled>Disabled action</b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
      </div>
      <div class="list-group-item">It has support for touch devices.</div>
      <div class="list-group-item">Just drag some elements around.</div>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs"

export default {
  layout: "default",
  name: "Project",
  mounted() {
    new Sortable(document.getElementById("simpleList"), {
      group: "shared"
    })
    new Sortable(document.getElementById("gridDemo"), {
      direction: "horizontal"
    })
  }
}
</script>
<style scoped>
input {
  border: none;
}
input:focus {
  outline: none;
}
.grid-square {
  display: inline-block;
  padding: 15px;
  margin: 5px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 4px;
}
</style>
