<template>
  <div>
    <div id="surveyCreatorContainer"></div>
  </div>
</template>

<script>
import { http } from "@/axios"
import * as SurveyCreator from "survey-creator"
import "survey-creator/survey-creator.css"
//import * as SurveyKo from "survey-knockout"
//import * as widgets from "surveyjs-widgets"
//import { init as customWidget } from "../components/customWidget"
// widgets.icheck(SurveyKo);
//widgets.select2(SurveyKo)
//widgets.inputmask(SurveyKo)
//widgets.jquerybarrating(SurveyKo);
//widgets.jqueryuidatepicker(SurveyKo);
//widgets.nouislider(SurveyKo)
//widgets.select2tagbox(SurveyKo)
//widgets.sortablejs(SurveyKo)
//widgets.ckeditor(SurveyKo)
//widgets.autocomplete(SurveyKo)
//widgets.bootstrapslider(SurveyKo)
//customWidget(SurveyKo)
//SurveyKo.Serializer.addProperty("question", "tag:number")
/* var CkEditor_ModalEditor = {
  afterRender: function (modalEditor, htmlElement) {
    var editor = window["CKEDITOR"].replace(htmlElement)
    editor.on("change", function () {
      modalEditor.editingValue = editor.getData()
    })
    editor.setData(modalEditor.editingValue)
  },
  destroy: function (modalEditor, htmlElement) {
    var instance = window["CKEDITOR"].instances[htmlElement.id]
    if (instance) {
      instance.removeAllListeners()
      window["CKEDITOR"].remove(instance)
    }
  },
} */
/* SurveyCreator.SurveyPropertyModalEditor.registerCustomWidget(
  "html",
  CkEditor_ModalEditor
) */
SurveyCreator.StylesManager.applyTheme("winter")
export default {
  name: "survey-creator",
  props: {
    Json: String,
    type: String,
  },
  data() {
    return {
      reference: "",
    }
  },
  mounted() {
    let params = new URL(document.location).searchParams
    let reference = params.get("reference")
    let options = {
      showEmbededSurveyTab: false,
      questionTypes: ["text", "checkbox", "radiogroup", "rating", "comment"],
      showLogicTab: false,
      showJSONEditorTab: false,
    }
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      "surveyCreatorContainer",
      options
    )
    if (this.Json) {
      this.surveyCreator.text = this.Json
    }

    if (this.type == "Edit") {
      this.surveyCreator.saveSurveyFunc = async function () {
        let surveyJson = JSON.stringify(this.text)
        let rv = await http.post("/api/me/survey/update", {
          reference,
          surveyJson,
        })
        if (rv) {
          window.location.href = "/profile"
        }
      }
    } else {
      this.surveyCreator.saveSurveyFunc = async function () {
        let surveyJson = JSON.stringify(this.text)
        let rv = await http.post("/api/me/survey/create", {
          reference,
          surveyJson,
        })
        if (rv) {
          window.location.href = "/profile"
        }
      }
    }
  },
  methods: {
    saveSurvey(value) {
      console.log(this.text)
    },
  },
}
</script>

<style scoped>
.svd-tabs {
  display: flex;
}

.v-application ul {
  list-style-type: none;
}

.svd_commercial_container {
  display: none !important;
}
</style>