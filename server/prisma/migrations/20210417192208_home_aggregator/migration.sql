-- CreateTable
CREATE TABLE "Pages" (
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT E'{}',

    PRIMARY KEY ("name")
);
