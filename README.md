# kryptokrauts.com
[![Build Status](https://travis-ci.org/kryptokrauts/kk-web.svg?branch=master)](https://travis-ci.org/kryptokrauts/kk-web)


[https://kryptokrauts.com/](https://kryptokrauts.com/)






contains all sources and content for kryptokrauts.com

## Development
Just clone the repo:

``` sh
$ git clone git@github.com:kryptokrauts/kk-web.git
```

## Run with Docker
And run development server:

``` sh
$ docker-compose up server
```

To build static files:

``` sh
$ docker-compose run hugo
```
## Run with Binary

### To install hugo on Linux:

``` sh
$ curl -L https://github.com/gohugoio/hugo/releases/download/v0.41/hugo_0.41_linux-64bit.tar.gz | tar -xz && mv hugo /usr/local/bin/hugo
```

### To install hugo on Windows, use [Chocolatey](https://chocolatey.org/):

``` sh
$ choco install hugo -confirm
```

If hugo binary is available, start server:

``` sh
$ hugo server
```

To build static files:

``` sh
$ hugo
```




