-- =================================================================================
-- Author:      [Tu Nombre / José Antonio]
-- Create date: 07/09/2026
-- Description: Creación de BD y tablas para la evaluación técnica de Jabil
-- =================================================================================

-- Creación DB
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'JabilTestDB')
BEGIN
    CREATE DATABASE JabilTestDB;
END
GO

USE JabilTestDB;
GO

-- Tabla Director
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Director]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Director] (
        -- Se agrega IDENTITY(1,1) para que el ID sea autoincrementable
        [PKDirector] INT IDENTITY(1,1) NOT NULL,
        [Name] VARCHAR(100) NOT NULL,
        [Age] INT NULL,
        [Active] BIT NOT NULL DEFAULT 1, 
        --BIT (1 = true, 0 = false)
        
        CONSTRAINT [PK_Director] PRIMARY KEY CLUSTERED ([PKDirector] ASC)
    );
END
GO

-- Tabla Movies
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Movies]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Movies] (
        [PKMovies] INT IDENTITY(1,1) NOT NULL,
        [Name] VARCHAR(100) NOT NULL,
        [Gender] VARCHAR(50) NULL, -- Se mantiene 'Gender' verbatim como pide el diagrama
        [Duration] TIME NULL,
        [FKDirector] INT NOT NULL,
        
        CONSTRAINT [PK_Movies] PRIMARY KEY CLUSTERED ([PKMovies] ASC),
        CONSTRAINT [FK_Movies_Director] FOREIGN KEY ([FKDirector]) 
            REFERENCES [dbo].[Director] ([PKDirector])
            ON DELETE CASCADE -- Si se borra un director, se borran sus películas
    );
END
GO

PRINT 'Base de datos JabilTestDB y tablas creadas con éxito.';
GO