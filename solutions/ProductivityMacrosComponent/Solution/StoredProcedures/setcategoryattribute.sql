begin try
	begin tran T1
    declare @count int;
    select @count = count(*) from WorkflowBase where Category = 6 and ISJSON(ClientData) > 0 and JSON_VALUE(ClientData, '$.subcategory') = 'CDSClientAutomation'
    print concat('Number of valid macro records to be updated: ', @count)
	update WorkflowBase set Category = 9000 where Category = 6 and ISJSON(ClientData) > 0 and JSON_VALUE(ClientData, '$.subcategory') = 'CDSClientAutomation'
    print 'Macros migration completed.'
	commit tran T1
end try
begin catch
	rollback tran T1
	print 'EXECUTION FAILED: ' + ERROR_MESSAGE()
end catch