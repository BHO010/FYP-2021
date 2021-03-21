let tags = [
  "Business",
  "Leadership and Management",
  "Marketing",
  "Accounting",
  "Business Strategy",
  "Arts",
  "Shopping",
  "Art",
  "Finance",
  "Information Technology",
  "Economics",
  "Mechanical Engineering",
  "Chemistry",
  "Physics",
  "Electrical Engineering",
  "Biology",
  "Programming",
  "Computer Science",
  "Math"
]

let top = [
  "longHair",
  "shortHair",
  "hat",
  "hijab",
  "turban"
]

let hatColor = [
  "black",
  "blue",
  "gray",
  "heather",
  "pastel",
  "pink",
  "red",
  "white"
]

let hairColor = [
  "auburn",
  "black",
  "blonde",
  "brown",
  "pastel",
  "platinum",
  "red",
  "gray"
]

let accessories = [
  "none",
  "kurt",
  "prescription01",
  "prescription02",
  "round",
  "sunglasses",
  "wayfarers"
]

let facialHair = [
  "none",
  "medium",
  "light",
  "majestic",
  "fancy",
  "magnum"
]

let facialHairColor = [
  "auburn",
  "black",
  "blonde",
  "brown",
  "platinum",
  "red"
]

let clothes = [
  "blazer",
  "sweater",
  "shirt",
  "hoodie",
  "overall"
]

let clothesColor = [
  "black",
  "blue",
  "gray",
  "heather",
  "pastel",
  "pink",
  "red",
  "white"
]

let eyes = [
  "close",
  "cry",
  "default",
  "dizzy",
  "roll",
  "happy",
  "hearts",
  "side",
  "squint",
  "surprised",
  "wink",
  "winkWacky"
]

let eyebrow = [
  "angry", "default", "flat", "raised", "sad", "unibrow", "up"
]

let mouth = [
  "concerned", "default", "disbelief", "eating", "grimace", "sad", "scream", "serious", "smile", "tongue", "twinkle", "vomit"
]

let skin = [
  "tanned", "yellow", "pale", "light", "brown", "darkBrown", "black"
]


function getTags() {
  return tags
}

function getTop() {
  return top
}

function getHatColor() {
  return hatColor
}

function getHaircolor() {
  return hairColor
}

function getAccessories() {
  return accessories
}

function getFacialHair() {
  return facialHair
}

function getFacialHairColor() {
  return facialHairColor
}

function getClothes() {
  return clothes
}

function getClothesColor() {
  return clothesColor
}

function getEyes() {
  return eyes
}

function getEyebrown() {
  return eyebrow
}

function getMouth() {
  return mouth
}

function getSkin() {
  return skin
}

module.exports = {
  getTags,
  getTop,
  getHatColor,
  getHaircolor,
  getAccessories,
  getFacialHair,
  getFacialHairColor,
  getClothes,
  getClothesColor,
  getEyes,
  getEyebrown,
  getMouth,
  getSkin

}