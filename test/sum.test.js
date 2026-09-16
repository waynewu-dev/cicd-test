import test from 'node:test';
import assert from 'node:assert/strict';
import { sum, buildTag } from '../src/index.js';

test('sum 计算数字数组之和', () => {
  assert.equal(sum([1, 2, 3]), 6);
});

test('sum 忽略非数字项', () => {
  assert.equal(sum([1, 'x', 2, null, 3]), 6);
});

test('sum 空数组返回 0', () => {
  assert.equal(sum([]), 0);
});

test('sum 非数组参数抛出 TypeError', () => {
  assert.throws(() => sum('not an array'), TypeError);
});

test('buildTag 拼接版本号与构建号', () => {
  assert.equal(buildTag('1.0.0', 42), '1.0.0+42');
});
