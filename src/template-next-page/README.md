# Nextjs page router template

## Docker部署

### 测试环境
```sh
# build
docker build --build-arg NODE_ENV=test -t next-page:1.0 .
# run
docker run -d -p 3000:3000 --name next-page next-page:1.0
```

### 正式环境
```sh
# build
docker build --build-arg NODE_ENV=production -t next-page:1.0 .
# run
docker run -d -p 3000:3000 --name next-page next-page:1.0
```
