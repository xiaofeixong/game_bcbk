fis.hook('relative');
fis.set('project.files', ['src/**', 'lib/**', 'static/**']);
fis.config.set("project.watch.usePolling", true)
fis.set('statics', '/statics'); //static目录
fis.set('domain_test', '');
fis.set('domain_prod', '//static.fdc.com.cn/zhuanti/game_bcbk');



/*************************目录规范*****************************/
fis
  .match("*", {
    relative: true
  })
  .match("(src|lib)", {
    release: '${statics}/$&'
  })
  .match("**.tpl", {
    release: false
  })
  .match("src/app/*", {
    release: false
  })
  .match('*.png', {
    optimizer: fis.plugin('png-compressor', {
      type: 'pngquant'
    })
  })
  .match("/src/page/*/(*.html)", {
    release: '$1'
  })



/****************异构语言编译*****************/
fis
  .match('src/**.scss', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('node-sass', {}),
    postprocessor: fis.plugin('autoprefixer', {
      //browsers: ['IE >= 8', 'Chrome >= 30', 'last 2 versions'] // pc
      browsers: ['Android >= 4', 'iOS >= 6']
      // browsers: ['Android >= 4', 'ChromeAndroid > 1%', 'iOS >= 6'] // wap
    }),
    preprocessor: fis.plugin('px2rem', {
      designWidth: 750
    }),
  })
// .match('src/**.js', {
//   parser: fis.plugin('babel-6.x', {
//     sourceMaps: true,
//     //   optional: ["es7.decorators", "es7.classProperties"]
//   }),
//   rExt: '.js'
// });



//打包与css sprite基础配置
// fis.match('::packager', {
//     spriter: fis.plugin('csssprites', {
//       htmlUseSprite: true, //开启模板内联css处理,默认关闭
//       styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig,
//       margin: 5 //图之间的边距
//     })
//   })



/**********************生产环境下CSS、JS压缩合并*****************/
//使用方法 fis3 release test
fis.media('test')
  .match('*', {
    domain: "${domain_test}"
  })
  .match('**', {
    deploy: [
      fis.plugin('local-deliver', {
        to: 'dist'
      })
    ]
  })
  .match('**.scss', {
    optimizer: fis.plugin('clean-css'),
  })
  .match('**.js', {
    optimizer: fis.plugin('uglify-js'),
  })

//使用方法 fis3 release prod
fis.media('prod')
  .match('*', {
    domain: "${domain_prod}"
  })
  .match('**', {
    deploy: [
      fis.plugin('local-deliver', {
        to: 'dist'
      })
    ]
  })
  .match('**.scss', {
    optimizer: fis.plugin('clean-css'),
  })
  .match('**.js', {
    optimizer: fis.plugin('uglify-js'),
  })