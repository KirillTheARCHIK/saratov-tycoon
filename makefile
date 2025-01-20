start:
	docker-compose up -d --build
	make hot-reload

start-extended:
	docker-compose up -d --build
	make app-update
	make hot-reload

app-update:
	docker-compose exec back npm i
	docker-compose exec front npm i

hot-reload:
	docker-compose exec front npm run dev

enter:
	docker-compose exec back bash