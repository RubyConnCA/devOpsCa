-- Made by Ruby
DROP DATABASE IF EXISTS `reqqit`;

create database `reqqit`;

use reqqit;

create table customer(
customerID int not null primary key auto_increment,
fName varchar(255) not null,
lName varchar(255) not null,
userName varchar(255) not null,
email varchar(255) not null,
pass_word varchar(255) not null
);

create table products(
productID int not null primary key auto_increment,
productName varchar(255) not null,
price double not null,
customerID int not null,
hasBox boolean,
foreign key (customerID) references customer(customerID) on delete cascade 
);

-- customer table insert
-- Jcena password is password1 
insert into customer(fName, Lname, userName, email, pass_word) values ("John","Cena","Jcena","johnc@email.com","$2a$05$yvHo6wr5kC4FqQKvGEXqF.RUIw0sO3NtuZHNzNDz1TSAjypDhvzuS");
