﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApi.Migrations
{
    public partial class UpdateUserPassEncrypt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("Password","Users");

            migrationBuilder.AddColumn<byte[]>(
                name: "Password",
                table: "Users",
                nullable: false,
                defaultValue: "Le22122017"
                //oldClrType: typeof(string),
                //oldType: "nvarchar(max)"
                );

            //migrationBuilder.AlterColumn<byte[]>(
            //    name: "Password",
            //    table: "Users",
            //    nullable: false,
            //    defaultValue: "Le22122017"
            //    //oldClrType: typeof(string),
            //    //oldType: "nvarchar(max)"
            //    );

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordKey",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordKey",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(byte[]));
        }
    }
}
