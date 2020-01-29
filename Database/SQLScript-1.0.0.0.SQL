
-- INSERT New Status in CU_S_STATUS ( Existing NHC Client , Duplicate)
insert into cu_s_status
select '060','001','40', 'Existing NHC Client', '2017-01-01','2050-01-01',getdate(),'SPX', NULL,NULL, newid()

insert into cu_s_status
select '060','001','50', 'Duplicate', '2017-01-01','2050-01-01',getdate(),'SPX', NULL,NULL, newid()