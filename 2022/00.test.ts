namespace template {
	function main(): void {
		console.log('hello advent typescript');
	}

	test('example 1', function (): void {
		expect(true).toBe(true);
	});

	test('example 2', function (): void {
		expect(false).toBe(false);
	});

	afterAll(main);

	const input: string = '';
}
