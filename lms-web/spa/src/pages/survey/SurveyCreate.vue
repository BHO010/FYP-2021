<template>
    <v-container fluid>
        <div class="main">
            <h3>Course Survey Creation</h3>
            <p>
                A survey creation plugin. Drag and drop the question from the toolbox on the left to the center area.<br> 
                Edit the question on the properties column on the right. <br>

                You can create a new page using the "Add new page" button. <br>

                You can click on "Test Survey" to preview the survey. <br>

                Once completed, remember to click "Save Survey" button. <br>
            </p>
            <survey-creator></survey-creator>
        </div>
    </v-container>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
    data() {
        return {
        }
    },
    mounted() {
    },
    computed: {},
    methods: {}
}
</script>

<style scoped>

.main {
    width: 80%;
    margin:auto;
}

.main h3 {
    font-family: "DarkerGrotesque-Medium";
    font-size: 42px;
    margin-bottom: 1%;
    color: #0d47a1;
}

.main p {
    font-family: "DarkerGrotesque-Medium";
    font-size: 22px;
    margin-left: 0.5%;
}
</style>