<template>
    <div>
         <h3>Course Survey Creation</h3>
            <survey-creator v-on:saveSurvey="onSaveSurvey"></survey-creator>
            <v-row justify="end">
              <v-btn class="button" color="#FF733C" @click="testSurvey()"
                >Print</v-btn
              >
              <v-btn class="button" color="#FF733C" @click="addCourse()" block
                >Create Course</v-btn
              >
            </v-row>
    </div>
</template>