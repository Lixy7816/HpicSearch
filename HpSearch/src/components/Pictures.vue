<template slot="item" slot-scope="props">
<vue-waterfall-easy :imgsArr="imgsArr"
                    :gap="20"
                    :height="400"
                    :loadingDotCount='0'
                    :imgWidth='180'>
        <div slot-scope="props">
            <p v-html="props.value.info"></p>
        </div>
</vue-waterfall-easy>
</template>

<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
export default {
  name: 'Pictures',
  components: {
    vueWaterfallEasy
  },
  data () {
    return {
      imgsArr: [],
      group: 0 // request param
    }
  },
  methods: {
    getData () {
      var res = {
        data: {
          'src': 'static/pictures/cat' + this.group + '.jpg',
          'herf': ''
        }
      }
      this.imgsArr = this.imgsArr.concat(res.data)
      this.group++
    //   axios.get('./static/mock/data.json?group=' + this.group) // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个惊呆json文件模拟
    //     .then(res => {
    //       this.imgsArr = this.imgsArr.concat(res.data)
    //       this.group++
    //     })
    }
  },
  created () {
    this.getData()
    console.log(this.imgsArr)
  },
  data1 () {
    var pics_dir = 'static/pictures/'
    var nameList = []
    nameList.push('cat1.jpg')
    nameList.push('cat2.jpg')
    nameList.push('cat3.jpg')
    nameList.push('cat4.jpg')
    var srcList = []
    for (var i = 0; i < nameList.length; i++) {
      srcList.push(pics_dir + nameList[i])
    }
    return {
      url: pics_dir + 'cat4.jpg',
      srcList: srcList
    }
  }
}
</script>
