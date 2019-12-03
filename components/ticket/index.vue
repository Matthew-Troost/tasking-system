<template>
  <b-card class=" mb-30">
    <div class="d-sm-flex align-item-sm-center flex-sm-nowrap">
      <div>
        <h5><a href="">#23. New icons set for an iOS app</a></h5>
        <p class="ul-task-manager__paragraph mb-3">
          A collection of textile samples ..
        </p>
        <a href="#" class="m-1">
          <i
            class="ul-task-manager__fonts i-Add text-30 "
            style="vertical-align:middle"
          ></i>
        </a>
        <a
          href=""
          class="btn btn-icon bg-transparent border-slate-300 text-slate rounded-round border-dashed"
          ><i class="icon-plus22"></i
        ></a>
      </div>

      <ul class="list list-unstyled mb-0 mt-3 mt-sm-0 ml-auto">
        <li>
          <span class="ul-task-manager__font-date text-muted">20 Jan,2015</span>
        </li>
        <li><a href="#">Eternity app</a></li>
      </ul>
    </div>
    <div slot="footer">
      <small
        class="text-muted d-sm-flex justify-content-sm-between align-items-sm-center"
      >
        <span>Due: <span class="font-weight-semibold">18 hours</span></span>

        <div class="list-inline mb-0 mt-2 mt-sm-0">
          <b-dropdown
            variant="link p-0"
            toggle-class="text-decoration-none"
            no-caret
          >
            <template slot="button-content"
              >On hold</template
            >
            <b-dropdown-item href="#">Action</b-dropdown-item>
            <b-dropdown-item href="#">Another action</b-dropdown-item>
            <b-dropdown-item href="#">Something else here...</b-dropdown-item>
          </b-dropdown>

          <b-dropdown
            variant="link p-2"
            toggle-class="text-decoration-none"
            no-caret
          >
            <template slot="button-content"
              ><i class="i-Gear-2"></i
            ></template>
            <b-dropdown-item href="#">Action</b-dropdown-item>
            <b-dropdown-item href="#">Another action</b-dropdown-item>
            <b-dropdown-item href="#">Something else here...</b-dropdown-item>
          </b-dropdown>
        </div>
      </small>
    </div>
  </b-card>
</template>
