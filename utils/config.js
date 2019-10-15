const config = {
  platform: 'mall',
  base_url: 'https://yo.ruoyw.com/bsj/api/mall/index.php',
  token_valid_time: 6300,//token有效期（15分钟缓冲期）
  location_time: 300,//定位地址缓存时间
  wx_env: 'production', //开发环境development,生产环境production
  version: '1.0.0.1',
  t_version: 't19.3.19'
}

module.exports = config;