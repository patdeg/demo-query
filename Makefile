.EXPORT_ALL_VARIABLES:

IMAGE_NAME=patdeg/demo-query
#REPO=hub.docker.com/
REPO=
NEXT_VERSION=$(shell cat VERSION | awk '{print $$1+1}')
VERSION=$(shell cat VERSION)
DEBUG=0

default:	build

all:	default prod

prune:
	@echo ===============
	@echo PRUNE
	@echo ===============
	docker system prune
	
fmt:
	@echo ===============
	@echo FMT
	@echo ===============
	go fmt ./...

lint:
	@echo ===============
	@echo LINT
	@echo ===============	
	cd src; golangci-lint run
	eslint src/static/js/app.js

# sudo npm install -g less
# sudo npm install -g less-plugin-clean-css
css:
	lessc bootstrap-src/less/bootstrap.less > src/static/lib/my-bootstrap.css
	lessc --clean-css="--s1 --advanced --compatibility=ie8" bootstrap-src/less/bootstrap.less > src/static/lib/my-bootstrap.min.css

build:
	@echo ===============
	@echo BUILD
	@echo ===============
	cd src ; docker build --build-arg DEBUG=1 -t $(IMAGE_NAME) .
	docker tag $(IMAGE_NAME) $(REPO)$(IMAGE_NAME):dev
	docker push $(REPO)$(IMAGE_NAME):dev
	@echo Image ready at $(REPO)$(IMAGE_NAME):dev

prod:
	@echo ===============
	@echo PROD
	@echo ===============
	@echo $(NEXT_VERSION) > VERSION
	@echo Building Version $(NEXT_VERSION)
	cd src ; docker build --no-cache --build-arg DEBUG=0 -t $(IMAGE_NAME) .
	docker tag $(IMAGE_NAME) $(REPO)$(IMAGE_NAME):$(NEXT_VERSION)
	docker push $(REPO)$(IMAGE_NAME):$(NEXT_VERSION)
	docker push $(REPO)$(IMAGE_NAME):latest
	@echo Image ready at $(REPO)$(IMAGE_NAME):$(NEXT_VERSION)

