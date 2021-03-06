SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ApiUserRights](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Description] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.ApiUserRights] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MenuGroups](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Description] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.MenuGroups] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pages](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](max) NULL,
	[Url] [nvarchar](max) NULL,
	[Order] [int] NOT NULL,
	[ParentPageId] [int] NULL,
	[CssClass] [nvarchar](max) NULL,
	[MenuGroupId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[PointsToNewCMS] [bit] NOT NULL,
 CONSTRAINT [PK_dbo.Pages] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PageUserRightMapping](
	[PageId] [int] NOT NULL,
	[UserRightId] [int] NOT NULL,
 CONSTRAINT [PK_dbo.PageUserRightMapping] PRIMARY KEY CLUSTERED 
(
	[PageId] ASC,
	[UserRightId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET IDENTITY_INSERT [dbo].[ApiUserRights] ON 

GO
INSERT [dbo].[ApiUserRights] ([Id], [Description]) VALUES (1, N'PublicAPI')
GO
INSERT [dbo].[ApiUserRights] ([Id], [Description]) VALUES (2, N'PrivateAPI')
GO
INSERT [dbo].[ApiUserRights] ([Id], [Description]) VALUES (3, N'ManagementAPI')
GO
SET IDENTITY_INSERT [dbo].[ApiUserRights] OFF
GO
SET IDENTITY_INSERT [dbo].[MenuGroups] ON 

GO
INSERT [dbo].[MenuGroups] ([Id], [Description]) VALUES (1, N'Catalog')
GO
INSERT [dbo].[MenuGroups] ([Id], [Description]) VALUES (2, N'Management')
GO
SET IDENTITY_INSERT [dbo].[MenuGroups] OFF
GO
SET IDENTITY_INSERT [dbo].[Pages] ON 

GO
INSERT [dbo].[Pages] ([Id], [Title], [Url], [Order], [ParentPageId], [CssClass], [MenuGroupId], [IsActive], [PointsToNewCMS]) VALUES (55, N'Analytics', N'#', 16, NULL, NULL, 1, 1, 0)
GO
INSERT [dbo].[Pages] ([Id], [Title], [Url], [Order], [ParentPageId], [CssClass], [MenuGroupId], [IsActive], [PointsToNewCMS]) VALUES (60, N'Client Side Analytics', N'/src/#private/analytics-summary', 1, 55, NULL, 1, 1, 1)
GO
INSERT [dbo].[Pages] ([Id], [Title], [Url], [Order], [ParentPageId], [CssClass], [MenuGroupId], [IsActive], [PointsToNewCMS]) VALUES (71, N'Integration', N'#', 20, NULL,NULL, 2, 1, 1)
GO
INSERT [dbo].[Pages] ([Id], [Title], [Url], [Order], [ParentPageId], [CssClass], [MenuGroupId], [IsActive], [PointsToNewCMS]) VALUES (72, N'Endpoint', N'/src/#management/integration-endpoint', 1, 71, NULL, 2, 1, 1)
GO
INSERT [dbo].[Pages] ([Id], [Title], [Url], [Order], [ParentPageId], [CssClass], [MenuGroupId], [IsActive], [PointsToNewCMS]) VALUES (73, N'My Style Genie', N'/src/#management/msg-integration', 1, 71, NULL, 2, 1, 1)
GO
SET IDENTITY_INSERT [dbo].[Pages] OFF
GO
INSERT [dbo].[PageUserRightMapping] ([PageId], [UserRightId]) VALUES (55, 2)
GO
INSERT [dbo].[PageUserRightMapping] ([PageId], [UserRightId]) VALUES (60, 2)
GO
INSERT [dbo].[PageUserRightMapping] ([PageId], [UserRightId]) VALUES (71, 2)
GO
INSERT [dbo].[PageUserRightMapping] ([PageId], [UserRightId]) VALUES (72, 2)
GO
INSERT [dbo].[PageUserRightMapping] ([PageId], [UserRightId]) VALUES (55, 3)
GO
INSERT [dbo].[PageUserRightMapping] ([PageId], [UserRightId]) VALUES (60, 3)
GO
INSERT [dbo].[PageUserRightMapping] ([PageId], [UserRightId]) VALUES (71, 3)
GO
INSERT [dbo].[PageUserRightMapping] ([PageId], [UserRightId]) VALUES (72, 3)
GO
INSERT [dbo].[PageUserRightMapping] ([PageId], [UserRightId]) VALUES (73, 3)
GO
ALTER TABLE [dbo].[Pages]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Pages_dbo.MenuGroups_MenuGroupId] FOREIGN KEY([MenuGroupId])
REFERENCES [dbo].[MenuGroups] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Pages] CHECK CONSTRAINT [FK_dbo.Pages_dbo.MenuGroups_MenuGroupId]
GO
ALTER TABLE [dbo].[Pages]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Pages_dbo.Pages_ParentPageId] FOREIGN KEY([ParentPageId])
REFERENCES [dbo].[Pages] ([Id])
GO
ALTER TABLE [dbo].[Pages] CHECK CONSTRAINT [FK_dbo.Pages_dbo.Pages_ParentPageId]
GO
ALTER TABLE [dbo].[PageUserRightMapping]  WITH CHECK ADD  CONSTRAINT [FK_dbo.PageUserRightMapping_dbo.ApiUserRights_UserRightId] FOREIGN KEY([UserRightId])
REFERENCES [dbo].[ApiUserRights] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PageUserRightMapping] CHECK CONSTRAINT [FK_dbo.PageUserRightMapping_dbo.ApiUserRights_UserRightId]
GO
ALTER TABLE [dbo].[PageUserRightMapping]  WITH CHECK ADD  CONSTRAINT [FK_dbo.PageUserRightMapping_dbo.Pages_PageId] FOREIGN KEY([PageId])
REFERENCES [dbo].[Pages] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PageUserRightMapping] CHECK CONSTRAINT [FK_dbo.PageUserRightMapping_dbo.Pages_PageId]
GO
