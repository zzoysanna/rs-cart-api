create extension if not exists "uuid-ossp";

create type status_type as enum ('OPEN', 'ORDERED');

create table carts(
	id uuid not null default uuid_generate_v4() primary key,
	user_id uuid not null,
	created_at timestamp not null default CURRENT_TIMESTAMP,
	updated_at timestamp not null default CURRENT_TIMESTAMP,
	status status_type
);

create table cart_items(
	product_id uuid not null,
	count integer not null
);

alter table cart_items add column cart_id uuid;
alter table cart_items add constraint fk_test foreign key (cart_id) references carts(id);

do $$
begin
   for counter in 1..5 loop
	insert into carts (user_id, status) values (uuid_generate_v4(), 'OPEN');
   end loop;
end; $$

do $$
begin
   for counter in 1..5 loop
	insert into carts (user_id, status) values (uuid_generate_v4(), 'ORDERED');
   end loop;
end; $$

do $$
declare
    temprow record;
begin
	for temprow in select * from public.carts loop
		insert into public.cart_items (cart_id, product_id, count) values (temprow.id, uuid_generate_v4(), floor(random() * 10 + 1)::int);
	end loop;
end; $$
