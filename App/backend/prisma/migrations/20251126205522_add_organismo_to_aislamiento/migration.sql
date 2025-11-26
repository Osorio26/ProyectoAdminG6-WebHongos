-- AlterTable
ALTER TABLE `Aislamientos` ADD COLUMN `idOrganismo` CHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Aislamientos` ADD CONSTRAINT `Aislamientos_idOrganismo_fkey` FOREIGN KEY (`idOrganismo`) REFERENCES `Organismos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
